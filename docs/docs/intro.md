---
id: intro
title: Introduction
slug: /
sidebar_position: 1
---

# react-typed-date

![npm version](https://img.shields.io/npm/v/react-typed-date)
![license](https://img.shields.io/badge/license-MIT-green)
![bundle size](https://img.shields.io/bundlephobia/minzip/react-typed-date)

A React library for creating an intuitive, keyboard-friendly date input field with segment navigation.

## Motivation

`react-typed-date` provides a lightweight date input experience inspired by [React ARIA DateField](https://react-spectrum.adobe.com/react-aria/DateField.html), offering the same intuitive keyboard navigation and segment editing in a zero-dependency package.

## Features

- 🎯 Intuitive keyboard navigation between date segments (month/day/year)
- 🚦 Smart date validation with awareness of month lengths and leap years
- ⌨️ Proper keyboard interaction with arrow keys for quick date adjustments
- 🎨 Easily stylable with your preferred CSS solution
- 📦 TypeScript support with full type definitions
- 🧩 Zero dependencies

## Alternatives

Note that `react-typed-date` is specifically designed as a date input field with segment navigation, not a date picker with a popup calendar. If you need a full calendar picker component, consider libraries like [react-day-picker](https://react-day-picker.js.org/) alongside this library.

Before choosing this library, consider exploring these alternatives. As `react-typed-date` is a hobby project, these alternatives might offer more extensive feature sets:

- [React Aria DateField](https://react-spectrum.adobe.com/react-aria/DateField.html) - Adobe's accessible implementation with comprehensive keyboard support and robust accessibility features, though it requires additional dependencies
- [MUI X Date Field](https://mui.com/x/react-date-pickers/date-field) - Material UI's polished implementation offering strong validation and formatting capabilities, but closely integrated with MUI's design system
- [RSuite DateInput](https://rsuitejs.com/components/date-input/) - Clean, well-documented implementation within the RSuite component ecosystem
- [Hero UI](https://www.heroui.com/docs/components/date-input) - Newer component library built on React Aria's foundation with consistent design patterns
- [React Date Picker](https://projects.wojtekmaj.pl/react-date-picker/) - Established library offering both segmented input and calendar functionality in one package
- [Native Date Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) - Browser's built-in implementation requiring no dependencies, but with limited styling options and inconsistent cross-browser behavior

Each alternative presents different tradeoffs regarding bundle size, styling flexibility, and dependencies. What sets `react-typed-date` apart is its focus on providing core functionality with zero dependencies while offering complete styling freedom.
