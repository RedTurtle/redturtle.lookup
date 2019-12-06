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

    def get_cache_infos(self):
        configuration = getConfiguration()
        names = configuration.dbtab.listDatabaseNames()
        results = []
        for name in sorted(names):
            if name in self.context:
                site = self.context[name]
                db = site._p_jar.db()
                results.append(
                    {
                        'id': name,
                        'title': site.Title(),
                        'objects': db.objectCount(),
                        'maxCacheSize': db.getCacheSize(),
                        'actualCacheSize': db.cacheSize(),
                        'percentage': int(
                            db.cacheSize() / db.getCacheSize() * 1000.0
                        )
                        / 10,
                    }
                )
        return results
