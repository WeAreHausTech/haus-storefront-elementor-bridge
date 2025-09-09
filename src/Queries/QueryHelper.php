<?php

namespace Haus\StorefrontElementorBridge\Queries;

class QueryHelper
{
    public $defaultLang = '';
    public $useWpml = false;

    public function getVendureCollections($lang, $data = [], $skip = 0, $take = 100)
    {
        $collections = (new \Haus\StorefrontElementorBridge\Queries\Collection)->get($lang, $skip, $take);

        if (!isset($collections['data']['collections']['items'])) {
            return [];
        }

        $items = $collections['data']['collections']['items'];
        $totalItems = $collections['data']['collections']['totalItems'];

        $data = array_merge($data, $items);

        if (count($data) === $totalItems) {
            return array_combine(array_column($data, 'id'), $data);
        } else {
            return $this->getVendureCollections($lang, $data, $skip + $take, $take);
        }
    }

    public function getVendureFacets($lang, $data = [], $skip = 0, $take = 100)
    {
        $facets = (new \Haus\StorefrontElementorBridge\Queries\Facet)->get($lang, $skip, $take);

        if (!isset($facets['data']['facets']['items'])) {
            return [];
        }

        $items = $facets['data']['facets']['items'];
        $totalItems = $facets['data']['facets']['totalItems'];

        $data = array_merge($data, $items);

        if (count($data) === $totalItems) {
            return array_combine(array_column($data, 'id'), $data);
        } else {
            return $this->getVendureFacets($lang, $data, $skip + $take, $take);
        }
    }
}