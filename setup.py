from setuptools import setup, find_packages
import os

version = '3.0.0'

setup(
    name='redturtle.lookup',
    version=version,
    description="List products information for different Plone sites in a single instance",
    long_description=open("README.rst").read() + "\n" +
    open(os.path.join("docs", "HISTORY.rst")).read(),
    # Get more strings from
    # http://www.python.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        "Environment :: Web Environment",
        "Framework :: Plone",
        "Framework :: Plone :: 5.0",
        "Framework :: Plone :: 5.1",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2.7",
        "Operating System :: OS Independent",
        "License :: OSI Approved :: GNU General Public License v2 (GPLv2)",
    ],
    keywords='Python Plone',
    author='RedTurtle',
    author_email='sviluppoplone@redturtle.it',
    url='https://github.com/RedTurtle/redturtle.lookup',
    license='GPL',
    packages=find_packages(exclude=['ez_setup']),
    namespace_packages=['redturtle'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'setuptools',
        'Products.CMFPlone>4.0b1',
        'pkginfo',
        'z3c.jbot'
    ],
    extras_require={
        'test': [
            'plone.app.testing',
            'plone.testing>=5.0.0',
            'plone.app.contenttypes',
            'plone.app.robotframework[debug]',
            'unittest2',
        ]
    },
    entry_points="""
    # -*- Entry points: -*-
    [z3c.autoinclude.plugin]
    target = plone
    """,
)
