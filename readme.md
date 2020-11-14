## YorProxyJS

This project is an experimental lightweight NodeJS proxy forwarding server. There are no dependencies, it includes the blacklisting of IP address as well as domains of your choosing from connecting to the server. The application logs the traffic to a daily log in the `./log` folder.

## Requirements

- Latest NodeJS

## Installing

#### Clone repo

```bash
git clone github.com/yordadev/YorProxyJS
cd YorProxyJS
mkdir log
```

#### Modify `lib/blacklisted.js` as needed

```js
exports.ip_addresses = [
  // '127.0.0.1',
  // '0.0.0.0',
  // ''
];

exports.hosts = [
  // 'google'
];
```

#### Running

```bash
node proxy.js
```

## Access Output Demo Screenshot

![access log screenshot](https://github.com/yordadev/YorProxyJS/blob/master/public/redflags.png)

