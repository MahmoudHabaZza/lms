import Swal from 'sweetalert2';

type ConfirmDeleteOptions = {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
};

export async function confirmDelete(options: ConfirmDeleteOptions = {}) {
    const result = await Swal.fire({
        title: options.title ?? '\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u062d\u0630\u0641',
        text:
            options.text ??
            '\u0633\u064a\u062a\u0645 \u062d\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0639\u0646\u0635\u0631 \u0646\u0647\u0627\u0626\u064a\u064b\u0627. \u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062c\u0631\u0627\u0621.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: options.confirmButtonText ?? '\u0646\u0639\u0645\u060c \u0627\u062d\u0630\u0641',
        cancelButtonText: options.cancelButtonText ?? '\u0625\u0644\u063a\u0627\u0621',
        reverseButtons: true,
        focusCancel: true,
        buttonsStyling: false,
        customClass: {
            popup: 'rounded-[28px] border border-slate-200 bg-white text-right shadow-2xl',
            title: 'text-2xl font-black text-slate-900',
            htmlContainer: 'text-sm leading-7 text-slate-600',
            actions: 'flex gap-3',
            confirmButton: 'rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500',
            cancelButton: 'rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50',
        },
        didOpen: (popup) => {
            popup.setAttribute('dir', 'rtl');
        },
    });

    return result.isConfirmed;
}
