# -*- coding: utf-8 -*-
from AccessControl import Unauthorized
from Products.CMFPlone.browser.admin import Overview
from Products.Five.browser import BrowserView
from plone import api  # noqa
from plone.protect.authenticator import createToken  # noqa
from zope.component import getMultiAdapter

import json


class StatusView(Overview):

    """Lookup view for product installation.
    """

    def __call__(self):
        data = {
            'sites': [],
            'products': [],
        }
        for site in self.sites():
            site_url = site.absolute_url()
            data['sites'].append({
                'id': site.id,
                'url': site_url,
                'title': site.title,
                'outdated': self.site_is_outdated(site),
                'upgrade_url': '{0}/@@plone-upgrade'.format(site_url),
                'products': {
                    'outdated': self.get_products_infos(
                        site, 'get_upgrades'),
                    'installed': self.get_products_infos(
                        site, 'get_installed'),
                    'available': self.get_products_infos(
                        site, 'get_available'),
                }

            })
            if not data['products']:
                data['products'] = self.get_products_infos(site, 'get_addons')
        self.request.response.setHeader('Content-type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        return json.dumps(data)
        return data

    def site_is_outdated(self, site):
        mig = site.get('portal_migration', None)
        if mig is not None:
            return mig.needUpgrading()
        return False

    def get_products_infos(self, site, method):
        view = api.content.get_view(
            context=site,
            name='prefs_install_products_form',
            request=self.request
        )
        res = getattr(view, method, None)()
        if isinstance(res, dict):
            return map(self.filter_infos, res.values())
        return map(self.filter_infos, res)

    def filter_infos(self, infos):
        filtered_infos = {}
        for key, value in infos.items():
            if key.endswith('_profile') or key.endswith('_profiles'):
                continue
            filtered_infos[key] = value
        return filtered_infos


class GenerateAuthenticatorTokenView(BrowserView):

    """Generate token for authenticator
    """

    def __call__(self):
        self.request.response.setHeader('Content-type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        return json.dumps({'authenticator': createToken()})


class HandleProductView(BrowserView):

    def __call__(self):
        authenticator = getMultiAdapter(
            (self.context, self.request), name=u'authenticator')
        if not authenticator.verify():
            raise Unauthorized
        productId = self.request.form.get('productId')
        res = self.do_action(productId)

        self.request.response.setHeader('Content-type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        return json.dumps(res)

    @property
    def support_view(self):
        return api.content.get_view(
            context=self.context,
            name='prefs_install_products_form',
            request=self.request
        )


class UpgradeProductView(HandleProductView):

    def do_action(self, productId):
        res = self.support_view.upgrade_product(productId)
        if not res:
            return {
                'ok': False,
                'msg': 'Unable to update this product. See error log'
            }
        return {'ok': True,
                'upgrade_info': self.support_view.upgrade_info(productId)
                }


class InstallProductView(HandleProductView):

    def do_action(self, productId):
        res = self.support_view.install_product(productId)
        if not res:
            return {
                'ok': False,
                'msg': 'Unable to update this product. See error log'
            }
        return {'ok': True,
                }


class UninstallProductView(HandleProductView):

    def do_action(self, productId):
        res = self.support_view.uninstall_product(productId)
        if not res:
            return {
                'ok': False,
                'msg': 'Unable to update this product. See error log'
            }
        return {'ok': True,
                }
