<h1 align="center">Welcome to freedictionaryapi 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ngocsangyem/freedictionaryapi#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ngocsangyem/freedictionaryapi/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/ngocsangyem/freedictionaryapi/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/ngocsangyem/freedictionaryapi" />
  </a>
  <a href="https://twitter.com/ngocsangyem" target="_blank">
    <img alt="Twitter: ngocsangyem" src="https://img.shields.io/twitter/follow/ngocsangyem.svg?style=social" />
  </a>
</p>

> Inspired by [freeDictionaryAPI](https://github.com/meetDeveloper/freeDictionaryAPI)

### 🏠 [Homepage](https://github.com/ngocsangyem/freedictionaryapi#readme)

### ✨ [Demo](https://api.freedictionary.dev/)

### Introduction

- More than 700k+ Definitions of word
- [freedictionaryapi](https://github.com/ngocsangyem/freedictionaryapi) base on open source Wiktionary.
- It is a simple and easy to use API to get the definition of a word.
- It is a free and open source project.

## Development

```sh
npm install
```

```sh
npm start
```

## Usage

### Definitions

```sh
https://api.freedictionary.dev/api/{version}/entries/en/{word}
```

#### Type Definitions

```typescript
interface IPhonetic {
 ipa: string;
 audio: string;
 type: string;
}

interface IForm {
 text: string;
 type: string;
}

interface IAntonym {
 text: string;
 meaning: string
}

interface ISynonym {
 text: string;
 meaning: string
}

interface IMeaning {
 definition: string;
 examples: string[]
 antonyms?: IAntonym[] | null;
 synonyms?: ISynonym[] | null;
}

interface IWord {
 word: string;
 partOfSpeech: string;
 phonetics?: IPhonetic[];
 meanings: IMeaning[];
 forms?: IForm[];
}
```

#### Example

```sh
https://api.freedictionary.dev/api/v1/entries/en/go
```

You will get result

```json
[
    {
        "word":"go",
        "partOfSpeech":"verb",
        "phonetics":[
            {
                "type":"uk",
                "audio":"https://upload.wikimedia.org/wikipedia/commons/transcoded/e/ef/En-uk-to_go.ogg/En-uk-to_go.ogg.mp3",
                "ipa":"/ɡəʊ/"
            },
            {
                "type":"us",
                "audio":"https://upload.wikimedia.org/wikipedia/commons/transcoded/0/0a/En-us-go.ogg/En-us-go.ogg.mp3",
                "ipa":"/ɡoʊ/"
            }
        ],
        "forms":[
            {
                "text":"goes",
                "type":"present singular third-person"
            },
            {
                "text":"going",
                "type":"participle present"
            },
            {
                "text":"went",
                "type":"past"
            }
        ],
        "meanings":[
            {
                "definition":"To move through space (especially to or through a place). (May be used of tangible things like people or cars, or intangible things like moods or information.)",
                "examples":[
                    "She was so mad she wouldn't speak to me for quite a spell, but at last I coaxed her into going up to Miss Emmeline's room and fetching down a tintype of the missing Deacon man.",
                ],
                "antonyms":[
                    {
                        "text":"freeze",
                        "meaning":""
                    },
                    {
                        "text":"halt",
                        "meaning":""
                    }
                ],
                "synonyms":[
                    {
                        "text":"move",
                        "meaning":""
                    },
                    {
                        "text":"fare",
                        "meaning":""
                    }
                ]
            }
        ]
    }
]
```

### Pronunciation

```sh
https://api.freedictionary.dev/api/{version}/pronunciation/en/{word}
```

#### Type Definitions

```typescript
interface IPhonetic {
 type: string;
 audio: string;
}

interface IPronunciation {
  word: string;
  phonetics: IPhonetic[];
}
```

#### Example

```sh
https://api.freedictionary.dev/api/v1/entries/en/go
```

You will get result

```json
{
  "word": "go",
  "phonetics": [
    {
      "type": "uk",
      "audio": "https://dictionary.cambridge.org/media/english/uk_pron/u/ukg/ukglu/ukglutt024.mp3"
    },
    {
      "type": "us",
      "audio": "https://dictionary.cambridge.org/media/english/us_pron/g/go_/go___/go.mp3"
    },
    {
      "type": "uk",
      "audio": "https://dictionary.cambridge.org/media/english/uk_pron/u/ukg/ukglu/ukglutt024.mp3"
    },
    {
      "type": "us",
      "audio": "https://dictionary.cambridge.org/media/english/us_pron/g/go_/go___/go.mp3"
    }
  ]
}
```

## Note

If you are using linguarobot, create `.env` and add linguarobot API key to it.

```
API_KEY=xxxxx
```

## Todo

- Performance query
- Docs
- Refactor code

## Author

👤 **ngocsangyem**

- Website: <https://www.ngocsangyem.dev/>
- Twitter: [@ngocsangyem](https://twitter.com/ngocsangyem)
- Github: [@ngocsangyem](https://github.com/ngocsangyem)
- LinkedIn: [@ngocsangyem](https://linkedin.com/in/ngocsangyem)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/ngocsangyem/freedictionaryapi/issues). You can also take a look at the [contributing guide](https://github.com/ngocsangyem/freedictionaryapi/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/ngocsangyem">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## 📝 License

Copyright © 2022 [ngocsangyem](https://github.com/ngocsangyem).<br />
This project is [MIT](https://github.com/ngocsangyem/freedictionaryapi/blob/main/LICENSE) licensed.
