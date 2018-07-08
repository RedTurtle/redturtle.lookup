# -*- coding: utf-8 -*-
from Products.CMFPlone.browser.admin import AppTraverser as AppTraverserBase
from redturtle.lookup.interfaces import ILookupMarkerInterface
from zope.component import adapter
from zope.publisher.interfaces import IRequest


@adapter(ILookupMarkerInterface, IRequest)
class AppTraverser(AppTraverserBase):

    def publishTraverse(self, request, name):
        if name == 'index_html':
            return self.context.restrictedTraverse(
                '++plone++lookup/index.html'
            )
        return AppTraverserBase.publishTraverse(self, request, name)
