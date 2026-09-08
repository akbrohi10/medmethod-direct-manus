import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WEBINAR_FORM_ID = "A3e1g5dCf1hc3tY3xpHi";
const WEBINAR_FORM_URL = `https://link.sendmeapro.com/widget/form/${WEBINAR_FORM_ID}`;

type WebinarRegistrationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * The third-party registration iframe is intentionally mounted only while this
 * dialog is open. This preserves a click-triggered webinar registration flow
 * and prevents the provider's `alwaysShow` embed attribute from rendering on
 * either landing page before a visitor chooses a registration CTA. The supplied
 * iframe loads the form directly, so the provider's global display helper is
 * intentionally not installed; it mutates React-owned DOM and conflicts with a
 * stable click-triggered dialog close lifecycle.
 */
export default function WebinarRegistrationDialog({
  open,
  onOpenChange,
}: WebinarRegistrationDialogProps) {
  const [formLoaded, setFormLoaded] = useState(false);
  const [formLoadError, setFormLoadError] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setFormLoaded(false);
      setFormLoadError(false);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-webinar-registration-dialog
        className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[46rem] gap-0 overflow-y-auto rounded-[1.25rem] border-[#e7c9d7] bg-[#fffafb] p-0 shadow-[0_24px_70px_rgba(61,20,57,0.3)] sm:max-w-[46rem]"
      >
        <DialogHeader className="border-b border-[#f0dce5] px-5 py-4 pr-12 text-left sm:px-7 sm:py-5">
          <DialogTitle className="font-serif text-[1.55rem] font-bold leading-tight text-[#35152f] sm:text-[1.8rem]">
            Reserve Your Free Webinar Spot
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-5 text-[#655461]">
            Complete the short form below to register for the live educational webinar.
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-[28.125rem] bg-white p-2 sm:p-3">
          {!formLoaded && !formLoadError && (
            <div
              data-webinar-registration-loading
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6 text-center text-sm font-semibold text-[#6f5a68]"
              aria-live="polite"
            >
              Loading secure registration form…
            </div>
          )}

          {formLoadError ? (
            <div
              data-webinar-registration-error
              className="relative z-10 flex min-h-[25rem] flex-col items-center justify-center rounded-lg border border-[#f1c6d8] bg-[#fff7fa] px-6 text-center"
              role="status"
            >
              <p className="text-base font-bold text-[#581a48]">The registration form could not load.</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#6f5a68]">
                Please close this window and try again. If the issue continues, refresh the page and reopen the registration form.
              </p>
            </div>
          ) : (
            <iframe
              src={WEBINAR_FORM_URL}
              style={{ width: "100%", height: "100%", minHeight: "450px", border: "none", borderRadius: "8px" }}
              id={`inline-${WEBINAR_FORM_ID}`}
              data-layout={'{"id":"INLINE"}'}
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Webinar Form"
              data-height="450"
              data-layout-iframe-id={`inline-${WEBINAR_FORM_ID}`}
              data-form-id={WEBINAR_FORM_ID}
              data-cookie-consent="true"
              data-cookie-consent-provider="auto"
              title="Webinar Form"
              onLoad={() => setFormLoaded(true)}
              onError={() => setFormLoadError(true)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
