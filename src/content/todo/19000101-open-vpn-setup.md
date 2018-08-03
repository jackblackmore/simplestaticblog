---
title:: Open VPN Setup
date: 1900-01-01
---
OpenVPN Setup: [https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-debian-8](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-debian-8)

Needed for OpenVZ setup: `iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -j SNAT --to-source your_vps_ip`

To make changes persistent [Automatically loading iptables rules on Debian/Ubuntu](https://major.io/2009/11/16/automatically-loading-iptables-on-debianubuntu/)
