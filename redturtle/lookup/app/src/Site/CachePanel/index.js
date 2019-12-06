// @flow
import React, { useState, useEffect } from 'react';
import { Segment, Table } from 'semantic-ui-react';
import { getCacheInfos } from '../../helpers/apiFetcher';
import { sortBy } from 'lodash';

type Props = {};

const CachePanel = (props: Props) => {
  const [cacheInfos, setCacheInfos] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('ascending');

  useEffect(() => {
    getCacheInfos().then(result => {
      setCacheInfos(result);
    });
  }, []);

  const handleSort = clickedColumn => () => {
    if (sortedColumn !== clickedColumn) {
      setSortedColumn(clickedColumn);
      setCacheInfos(sortBy(cacheInfos, [clickedColumn]));
      return;
    } else {
      setSortDirection(
        sortDirection === 'ascending' ? 'descending' : 'ascending',
      );
      setCacheInfos(cacheInfos.reverse());
    }
  };
  const formatNumber = num => {
    if (!num) {
      return num;
    }
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Segment basic>
      <Table celled sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={sortedColumn === 'id' ? sortDirection : null}
              onClick={handleSort('id')}
            >
              Site
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortedColumn === 'objects' ? sortDirection : null}
              onClick={handleSort('objects')}
            >
              Objects
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortedColumn === 'actualCacheSize' ? sortDirection : null}
              onClick={handleSort('actualCacheSize')}
            >
              Actual cache size
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortedColumn === 'maxCacheSize' ? sortDirection : null}
              onClick={handleSort('maxCacheSize')}
            >
              Max cache size
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortedColumn === 'percentage' ? sortDirection : null}
              onClick={handleSort('percentage')}
            >
              %
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {cacheInfos.map(site => (
            <Table.Row key={site.id}>
              <Table.Cell>{site.id}</Table.Cell>
              <Table.Cell>{formatNumber(site.objects)}</Table.Cell>
              <Table.Cell>{formatNumber(site.actualCacheSize)}</Table.Cell>
              <Table.Cell>{formatNumber(site.maxCacheSize)}</Table.Cell>
              <Table.Cell>{site.percentage}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default CachePanel;
