import React from 'react';
import { Stack } from 'expo-router';
import { StoreProvider } from '../store';
export default function Layout() { return <StoreProvider><Stack screenOptions={{ headerShown: false, animation: 'none' }}/></StoreProvider>; }
