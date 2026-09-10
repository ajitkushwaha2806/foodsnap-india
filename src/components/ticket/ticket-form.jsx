"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/store/hooks/useUser";
import { useTicket } from "@/store/hooks/useTicket";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail, Phone, User, MessageSquare, Tag, CheckCircle2 } from "lucide-react";
import posthog from "posthog-js";
import { trackMetaEvent } from "@/lib/meta-pixel";

export default function TicketForm() {
  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const { user } = useUser();
  const { handleCreateTicket, loadTickets } = useTicket();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string().trim().required("Phone number is required"),
      subject: Yup.string().trim().required("Subject is required"),
      message: Yup.string().trim().required("Message is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setSubmittedSuccess(false);

      try {
        await handleCreateTicket(values);
        posthog.capture("support_ticket_submitted", {
          subject: values.subject,
          has_user_account: Boolean(user),
        });
        trackMetaEvent("Contact", { content_name: values.subject });
        trackMetaEvent("Lead", { content_name: "Support Inquiry" });
        if (user) {
          loadTickets();
        }
        resetForm();
        setSubmittedSuccess(true);
        setTimeout(() => setSubmittedSuccess(false), 5000);
      } catch (error) {
        console.error("Ticket submission error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Support & Feedback
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Have a question, issue, or feature request? We&apos;re here to help you.
        </p>
      </div>

      <Card className="w-full border border-border rounded-xl bg-card shadow-xs">
        <CardContent className="p-5 sm:p-7">
          {submittedSuccess && (
            <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs sm:text-sm">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
              <span>Thank you! Your ticket has been received. Our team will get back to you shortly.</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Your Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    className="h-10 pl-9 rounded-md text-sm"
                    placeholder="e.g. Rahul Sharma"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    className="h-10 pl-9 rounded-md text-sm"
                    placeholder="e.g. 9876543210"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {formik.errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="h-10 pl-9 rounded-md text-sm"
                  placeholder="e.g. rahul@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Subject <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="subject"
                  name="subject"
                  className="h-10 pl-9 rounded-md text-sm"
                  placeholder="Issue or feature request..."
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-xs text-destructive mt-1">
                  {formik.errors.subject}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Message <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="pl-9 rounded-md text-sm min-h-28"
                  placeholder="Explain your issue, dish photo request, or question in detail..."
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.message && formik.errors.message && (
                <p className="text-xs text-destructive mt-1">
                  {formik.errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-md text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Submitting Request...
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground mt-3.5 text-xs">
        We typically respond within{" "}
        <span className="font-semibold text-foreground">2–6 hours</span>.
      </p>
    </div>
  );
}
