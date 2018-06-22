# -*- coding: utf-8 -*-
from Products.CMFPlone.browser.admin import AppTraverser as AppTraverserBase
from redturtle.lookup.interfaces import ILookupMarkerInterface
from zope.publisher.interfaces import IRequest
from zope.component import adapter


@adapter(ILookupMarkerInterface, IRequest)
class AppTraverser(AppTraverserBase):
    # adapts(ILookupMarkerInterface, IRequest)

    def publishTraverse(self, request, name):
        if name == 'index_html':
            return self.context.restrictedTraverse('++plone++prova/index.html')
        return AppTraverserBase.publishTraverse(self, request, name)
