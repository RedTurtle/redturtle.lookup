# -*- coding: utf-8 -*-
from AccessControl import getSecurityManager
from AccessControl import Unauthorized
from Products.CMFPlone.interfaces import IPloneSiteRoot
from App.config import getConfiguration
from plone import api  # noqa
from plone.protect.authenticator import createToken  # noqa
from Products.CMFPlone.browser.admin import Overview
from Products.Five.browser import BrowserView
from zope.component import getMultiAdapter

import json
import logging


logger = logging.getLogger(__name__)


class View(BrowserView):

    """Return cache infos per site
    """

    def __call__(self):
        data = self.get_cache_infos()
        self.request.response.setHeader('Content-type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        return json.dumps(data)

    def sites(self, root=None):
        if root is None:
            root = self.context

        result = []
        secman = getSecurityManager()
        for obj in root.values():
            if obj.meta_type is 'Folder':
                result = result + self.sites(obj)
            elif IPloneSiteRoot.providedBy(obj):
                if secman.checkPermission(View, obj):
                    result.append(obj)
            elif obj.getId() in getattr(root, '_mount_points', {}):
                result.extend(self.sites(root=obj))
        return result

    def get_cache_infos(self):        
        import pdb;pdb.set_trace()
        configuration = getConfiguration()
        names = configuration.dbtab.listDatabaseNames()
        result = []
        sites = self.sites()
        for name in names:
            if name in app:
                db = app[name]._p_jar.db()
                print '{}\t{}\t{}\t{}\t{}'.format(
                    name,
                    db.objectCount(),
                    db.getCacheSize(),
                    db.cacheSize(),
                    # db.getCacheSizeBytes(),
                    # db.cacheDetailSize(),
                    int(db.cacheSize() / db.getCacheSize() * 1000.0) / 10
                )
