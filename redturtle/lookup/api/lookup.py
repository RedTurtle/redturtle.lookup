# -*- coding: utf-8 -*-
from Products.Five.browser import BrowserView


class View(BrowserView):

    def __call__(self):
        return self.context.restrictedTraverse('++plone++lookup/index.html')


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
