from zope.interface import Interface


class ILookup(Interface):
    """Interface for the site inventory view.
    """

    def sites():
       """ list plone sites """

