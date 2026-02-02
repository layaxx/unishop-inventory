<div align="center">
  <h3 align="center">UniShop Inventory</h3>

  <p align="center">
    Inventory Management for the merchandising shop at University Bamberg
  </p>
</div>

## About The Project

![Screenshot](docs/images/screenshot-main.png)

> Inventory management for Unishop Bamberg (Next.js + shadcn + Prisma + PostgreSQL)

A lightweight inventory system used by the official Unishop at the University of Bamberg to manage products, variants, locations, stock movements and stock-taking audits. Built with Blitz.js / Next.js, Prisma (PostgreSQL) and shadcn UI components.

## Built With

* [![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white&style=for-the-badge)](#)
* [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB&style=for-the-badge)](#)
* [![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=for-the-badge)](#)
* [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=for-the-badge)](#)
* [![LaTeX](https://img.shields.io/badge/LaTeX-00A0A0?logo=latex&logoColor=fff&style=for-the-badge)](#)

## Prerequisites

- Node.js 20+ (recommended) + yarn
- Docker & Docker Compose (optional, recommended for local DB)

## Environment

This project expects a `.env.local` file (or other env file) with at least:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db>?schema=public"
```

When using the included `docker-compose.yml`, the DB runs on Postgres 18-alpine and reads env values from `.env.local`.


## Example Report

[Example Report (PDF)](docs/report-example.pdf)

![Short overview](docs/images/screenshot-short.png)

![Details](docs/images/screenshot-detail.png)
