from zope.interface import Interface


class ILookup(Interface):
    """Interface for the site inventory view.
    """

    def sites():
        """ list plone sites """


class ILookupProducts(Interface):
    """Interface for the site inventory view.
    """
    def sites_infos():
        """ get the list of available products """

    def getProductState(site, product_id):
        """ get the list of available products """


class IHandleProducts(Interface):
    """Interface for the products handling.
    """
    def install(pid):
        """ Install a product in a Plone site """

    def uninstall(pid, site_id):
        """ Uninstall a product in a Plone site """

    def upgrade(pid):
        """ Upgrade a product in a Plone site """
