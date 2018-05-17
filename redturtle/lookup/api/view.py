# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.interfaces import IPloneSiteRoot
from Products.Five.browser import BrowserView
from redturtle.lookup import logger
from Products.CMFPlone.browser.admin import Overview
from plone import api
import json


class StatusView(Overview):

    """Lookup view for product installation.
    """

    def __call__(self):
        data = {
            'sites': [],
            'products': []
        }
        for site in self.sites():
            data['sites'].append({
                'id': site.id,
                'title': site.title,
                'outdated': self.get_products_infos(site, 'get_upgrades'),
                'installed': self.get_products_infos(site, 'get_installed'),
                'available': self.get_products_infos(site, 'get_available'),
            })
            if not data['products']:
                data['products'] = self.get_products_infos(site, 'get_addons')
        self.request.response.setHeader('Content-type', 'application/json')
        self.request.response.setHeader("Access-Control-Allow-Origin", "*")
        return json.dumps(data)
        return data

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
