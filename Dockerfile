FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1

ENV NODE_ENV=production HOST=0.0.0.0 PORT=4183
WORKDIR /app

COPY --chown=node:node server.cjs index.html styles.css app.js ./
COPY --chown=node:node assets/favicon.svg assets/car-on-lift.webp assets/computer-diagnostics.webp assets/mechanic-working.webp assets/maintenance-parts.webp ./assets/
COPY --chown=node:node assets/car-front-cutout.webp assets/car-rear-cutout.webp assets/road-wavy.webp ./assets/
COPY --chown=node:node assets/fonts/ ./assets/fonts/
COPY --chown=node:node assets/lift/ ./assets/lift/

USER node
EXPOSE 4183
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4183/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.cjs"]
