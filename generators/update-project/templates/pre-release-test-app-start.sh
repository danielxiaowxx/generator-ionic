#!/usr/bin/env bash
gulp clean
gulp release
mv www www_back
mv release/www www