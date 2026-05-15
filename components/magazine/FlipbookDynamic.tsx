"use client";
import React, { forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";

// Módulo separado para permitir el reenvío de REF en Next.js (necesario para las flechas)
const FlipbookComponent = forwardRef((props: any, ref: any) => {
    return <HTMLFlipBook {...props} ref={ref} />;
});

FlipbookComponent.displayName = "FlipbookComponent";

export default FlipbookComponent;
