# Definition

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

 |           | Endpoint             | Description                           | Example                    |
 | :-------- | :--------------------| :------------------------------------ | :------------------------- |
 | `GET`     | `/entries/en/[word]` | Definitions of the given word         | /api/v1/entries/en/go      |
