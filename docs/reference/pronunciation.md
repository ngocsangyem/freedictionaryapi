# Pronunciation

::: warning
This doc is work-in-progress. Expect changes.
:::

## Path

| Location                                  | Endpoint                         |
| :---------------------------------------- |:---------------------------------|
| <https://api.freedictionary.dev>          | /api/[version]                   |

## Query

 |           | Type   | Description                    | Required | Default |
 | :-------- | :----- | :----------------------------- | :------- | :------ |
 | word      | String | The word to search for         | Yes      |         |
 | version   | String | The version of the API to use  | Yes      | v1      |

## Methods

 |           | Endpoint                   | Description                             | Example                          |
 | :-------- | :--------------------------| :-------------------------------------- | :--------------------------------|
 | `GET`     | `/pronunciation/en/[word]` | Pronunciation of the given word         | /api/v1/pronunciation/en/go      |

