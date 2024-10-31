#!/bin/bash

# Use this for deployment

cd client
yarn build:prod
vercel --prod