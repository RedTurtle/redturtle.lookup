from zope.interface import implements
from Products.Five.browser import BrowserView
from interfaces import ILookupProducts, IHandleProducts
from plone.memoize.view import memoize
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.interfaces import IPloneSiteRoot
import json
from pkginfo import Installed
from redturtle.lookup import lookupMessageFactory as _
from zope.i18n import translate
from redturtle.lookup import logger


class LookupProductsView(BrowserView):
    """Lookup view for product installation.
    """
    implements(ILookupProducts)

    @memoize
    def sites_infos(self):
        keys = sorted(self.context.keys())
        infos = {'sites': [],
                 'products': []}
        for key in keys:
            obj = self.context.get(key)
            if obj and IPloneSiteRoot.providedBy(obj):
                infos['sites'].append(obj)
                if not infos['products']:
                    qi = getToolByName(obj, 'portal_quickinstaller')
                    products = qi.listInstallableProducts()
                    products.extend(qi.listInstalledProducts())
                    infos['products'] = sorted(products, key=lambda x: x.get('title'))
        return infos

    def getProductState(self, site, product_id):
        """
        return info about given product
        """
        qi = getToolByName(site, 'portal_quickinstaller')
        if not qi.isProductInstalled(product_id):
            return {'status': "notInstalled"}
        try:
            upgrade_info = qi.upgradeInfo(product_id)
        except Exception:
            logger.exception("Unable to retrieve infos")
            return {'status': 'error'}
        res_dict = {}
        res_dict['installed_version'] = upgrade_info.get('installedVersion')
        res_dict['new_version'] = upgrade_info.get('newVersion')
        if upgrade_info.get('available') and upgrade_info.get('required'):
            res_dict['status'] = "toBeUpgraded"
        else:
            res_dict['status'] = "installed"
        return res_dict


class HandleProductsView(BrowserView):
    """View for product installation.
    """
    implements(IHandleProducts)

    def __call__(self):
        # site_id = self.request.form.get('site')
        product_id = self.request.form.get('product')
        action = self.request.form.get('action')
        if not product_id or not action:
            return "Error"
        if action == 'upgrade':
            result = self.upgrade(product_id)
        if action == 'install':
            result = self.install(product_id)
        if action == 'uninstall':
            result = self.uninstall(product_id)
        return result

    def install(self, pid):
        """ Install a product in a Plone site """
        qi = getToolByName(self.context, 'portal_quickinstaller')
        error_msg = translate(_("msg_error_install",
                              default=u"An error occurred during installation of ${product} on site ${site}. Please check the log.",
                              mapping={'product': pid,
                                       'site': self.context.getId()}),
                             context=self.request)
        try:
            result = qi.installProduct(pid)
            if not result:
                return json.dumps({'result': 'ok',
                                   'new_state': 'installed'})
            else:
                return json.dumps({'msg': result,
                                   'result': 'nok'})
        except Exception:
            logger.exception("Error in install step")
            return json.dumps({'msg': error_msg,
                               'result': 'nok'})

    def uninstall(self, pid):
        """ Uninstall a product in a Plone site """
        qi = getToolByName(self.context, 'portal_quickinstaller')
        error_msg = translate(_("msg_error_uninstall",
                      default=u"An error occurred during uninstall of ${product} on site ${site}. Please check the log.",
                      mapping={'product': pid,
                               'site': self.context.getId()}),
                            context=self.request)
        try:
            result = qi.uninstallProducts([pid])
            if not result:
                return json.dumps({'result': 'ok',
                                    'new_state': 'uninstalled'})
            else:
                return json.dumps({'msg': error_msg,
                                   'result': 'nok'})
        except Exception:
            logger.exception("Error in uninstall step")
            return json.dumps({'msg': error_msg,
                               'result': 'nok'})

    def upgrade(self, pid):
        """ Upgrade a product in a Plone site """
        qi = getToolByName(self.context, 'portal_quickinstaller')
        error_msg = translate(_("msg_error_upgrade",
                              default=u"An error occurred during upgrade of ${product} on site ${site}. Please check the log.",
                              mapping={'product': pid,
                                       'site': self.context.getId()}),
                            context=self.request)
        try:
            result = qi.upgradeProduct(pid)
            if not result:
                return json.dumps({'result': 'ok',
                                    'new_state': 'updated'})
            else:
                return json.dumps({'msg': error_msg,
                                   'result': 'nok'})
        except Exception:
            logger.exception("Error in upgrade step")
            return json.dumps({'msg': error_msg,
                               'result': 'nok'})


class ProductInfoView(BrowserView):
    """View for product infos.
    """
    @property
    def product_infos(self):
        product_id = self.request.form.get('product')
        dotted = Installed(product_id)
        return dotted

    def getExampleSite(self):
        keys = self.context.keys()
        for key in keys:
            obj = self.context.get(key)
            if obj and IPloneSiteRoot.providedBy(obj):
                return obj

    def getFormattedText(self, text):
        site = self.getExampleSite()
        if not site:
            return ""
        pt = getToolByName(site, 'portal_transforms')
        convert = pt.convertTo('text/html', text, mimetype='text/x-rst')
        if convert:
            return convert.getData()
        return ""
