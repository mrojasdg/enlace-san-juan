"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Search, Edit, Eye, Trash2, Star, CheckCircle, BarChart3, QrCode, Download } from "lucide-react";
import { ActivationToggle } from "@/components/admin/ActivationToggle";
import { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
