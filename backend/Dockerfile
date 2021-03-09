FROM hayd/alpine-deno:1.7.1
RUN deno install -qAf --unstable https://raw.githubusercontent.com/denosaurs/denon/main/denon.ts
WORKDIR /usr/app
COPY . .
ENTRYPOINT ["/usr/local/bin/denon"]