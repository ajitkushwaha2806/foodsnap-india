"use client";
import * as Yup from "yup";
import Link from "next/link";
import { useFormik } from "formik";
import Alert from "@/components/global/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/hooks/useUser";
import { useState, startTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import posthog from "posthog-js";

import { trackMetaEvent } from "@/lib/meta-pixel";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const { register, loading, error: apiError } = useUser();

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values) => {
      try {
        await register(values);
        posthog.capture("user_registered", {
          source: "sign_up_page",
          has_redirect: Boolean(redirectPath && redirectPath !== "/"),
        });
        trackMetaEvent("CompleteRegistration", { status: true });
        startTransition(() => {
          router.push(redirectPath);
        });
      } catch (err) {
        console.error("Registration error:", err);
      }
    },
  });

  const firstError =
    formik.submitCount > 0 && Object.keys(formik.errors).length > 0
      ? Object.values(formik.errors)[0]
      : apiError || null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-2 py-8 bg-slate-50 dark:bg-slate-950 selection:bg-primary/20 selection:text-primary">
      <Card className="w-full max-w-md border border-border/80 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 bg-card overflow-hidden py-0 gap-0">
        <div className="flex items-center justify-center p-4 bg-primary">
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-105 duration-200"
          >
            <img
              src="/assets/logo-transparent.png"
              alt="Foodsnap"
              className="h-24 w-auto object-contain"
            />
          </Link>
        </div>

        <CardContent className="p-6 sm:p-8 pt-6">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-foreground"
              >
                Full Name
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                />
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Chef Sanjeev"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="pl-10 h-12 text-sm sm:text-base rounded-lg border-border bg-background focus-visible:ring-primary/30"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-xs font-semibold text-foreground"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="9876543210"
                  type="tel"
                  maxLength={10}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className="pl-10 h-12 text-sm sm:text-base rounded-lg border-border bg-background focus-visible:ring-primary/30"
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                />
                <Input
                  id="password"
                  name="password"
                  placeholder="At least 6 characters"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="pl-10 pr-10 h-12 text-sm sm:text-base rounded-lg border-border bg-background focus-visible:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {firstError &&
              !formik.errors.name &&
              !formik.errors.phone &&
              !formik.errors.password && (
                <div className="pt-1">
                  <Alert
                    duration={0}
                    variant="error"
                    message={firstError}
                  />
                </div>
              )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm sm:text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 mt-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="animate-spin size-4" />
                  <span>Creating Account...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <span>Get Started Free</span>
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground text-[11px] font-medium">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                href={`/sign-in?redirect=${encodeURIComponent(redirectPath)}`}
                className="inline-flex items-center justify-center w-full h-12 px-4 text-sm font-semibold rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-foreground transition-all duration-150 shadow-2xs"
              >
                Sign In Instead
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground/80 mt-6 text-xs max-w-sm">
        By creating an account, you agree to FoodSnap&apos;s Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
