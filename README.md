# Markdown Links Extractor

## Comenzando 🚀

En la pestaña 'releases' encontrarás el archivo .zip correspondiente al proyecto, el que puedes descargar directamente para utilizar.

### Paquetes utilizados

- [Path](https://nodejs.org/api/path.html)
- [File System](https://nodejs.org/api/fs.html)
- [Chalk](https://www.npmjs.com/package/chalk)


### Instalación 🔧

Para utilizar esta librería primero debes descomprimir el archivo .zip que se encuentra disponible en la pestaña 'releases' de este repositorio. También puedes encontrar el package en la página de [npm](https://www.npmjs.com/package/theraven-md-links)

Debes instalar el módulo con npm

```
npm install https://github.com/ElizabethVegaM/md-links-2.0
```

## Snippets de uso 🎁

Este proyecto puede ser utilizado a través de la terminal CLI

Por ejemplo:

`md-links <path-to-file> [options]`
Donde options puede ser 'validate' para verificar el estado del link y/o 'stats' para ver estádisticas del archivo(path) como cantidad de links encontrados, links rotos, etc

```
$ md-links example.md

href: http://algo.com/2/3/
text: Link a algo
file: ./some/example.md: - 3

href: https://otra-cosa.net/algun-doc.html
text: Link a otra cosa
file: ./some/example.md: - 12

href: http://google.com/
text: Google
file: ./some/example.md: - 15
```
Usando validate:

```
$ md-links example.md --validate

href: http://algo.com/2/3/
text: Link a algo
file: ./some/example.md: - 3
code: 200 - OK

href: https://otra-cosa.net/algun-doc.html
text: Link a otra cosa
file: ./some/example.md: - 12
code: 404 - FAIL

href: http://google.com/
text: Google
file: ./some/example.md: - 15
code: 203 - OK
```

Usando --stats
```
Total: 9, Unique: 3
```

Usando --validate y --stats (pueden usarse tanto juntos como separados)
```
Total: 9, Unique: 1, Broken: 0
```
