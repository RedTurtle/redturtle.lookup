from zope.interface import implements
from Acquisition import aq_base
from Products.Five.browser import BrowserView
from interfaces import ILookup
from Products.CMFPlone.interfaces import IPloneSiteRoot


class Lookup(BrowserView):
    """Lookup view.
    """
    implements(ILookup)

    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)
        self.message = None

    def sites(self):
        for obj in self.context.values():
            if IPloneSiteRoot.providedBy(obj):
                yield obj
