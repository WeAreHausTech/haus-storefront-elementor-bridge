<?php
namespace Haus\StorefrontElementorBridge\Queries;

class Facet extends BaseQuery
{
    public function get($lang, $skip = 0, $take = 100)
    {

        $config = require(HAUS_ECOM_PLUGIN_PATH . '/config.php');

        $customFields = $config['productSync']['facets']['customFieldsQuery'] ?? '';

        $options = "(options: {
            take: $take,
            skip: $skip
        })";


        $this->query =
            "query {
                facets $options{
                   totalItems
                    items {
                        id
                        name
                        code
                        values{
                            id
                            name
                            code
                            updatedAt
                            $customFields
                        }
                    }
                }
            }
        ";

        return $this->fetch($lang);
    }
}