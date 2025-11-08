// "use client";

// import { useState, useCallback } from "react";

// export interface Toast {
//   id: string;
//   title?: string;
//   description?: string;
//   action?: {
//     label: string;
//     onClick: () => void;
//   };
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   variant?: "default" | "destructive";
// }

// const TOAST_LIMIT = 1;
// const TOAST_REMOVE_DELAY = 1000000;

// type ToasterToast = Toast & {
//   id: string;
//   title?: string;
//   description?: string;
//   action?: {
//     label: string;
//     onClick: () => void;
//   };
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// };

// let count = 0;

// function genId() {
//   count = (count + 1) % Number.MAX_VALUE;
//   return count.toString();
// }

// const actionTypes = {
//   ADD_TOAST: "ADD_TOAST",
//   UPDATE_TOAST: "UPDATE_TOAST",
//   DISMISS_TOAST: "DISMISS_TOAST",
//   REMOVE_TOAST: "REMOVE_TOAST",
// } as const;

// const listeners: Array<(state: ToasterToast[]) => void> = [];

// let memoryState: ToasterToast[] = [];

// function dispatch(action: any) {
//   memoryState = reducer(memoryState, action);
//   listeners.forEach((listener) => {
//     listener(memoryState);
//   });
// }

// function reducer(state: ToasterToast[], action: any): ToasterToast[] {
//   switch (action.type) {
//     case "ADD_TOAST": {
//       return [action.toast, ...state].slice(0, TOAST_LIMIT);
//     }

//     case "UPDATE_TOAST": {
//       return state.map((t) =>
//         t.id === action.toast.id ? { ...t, ...action.toast } : t
//       );
//     }

//     case "DISMISS_TOAST": {
//       const { toastId } = action;

//       if (toastId) {
//         setTimeout(() => {
//           dispatch({ type: "REMOVE_TOAST", toastId });
//         }, TOAST_REMOVE_DELAY);
//       } else {
//         state.forEach((toast) => {
//           setTimeout(() => {
//             dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
//           }, TOAST_REMOVE_DELAY);
//         });
//       }

//       return state.map((t) =>
//         t.id === toastId || toastId === undefined
//           ? {
//               ...t,
//               open: false,
//             }
//           : t
//       );
//     }
//     case "REMOVE_TOAST": {
//       if (action.toastId === undefined) {
//         return [];
//       }
//       return state.filter((t) => t.id !== action.toastId);
//     }
//   }
// }

// function toast(props: Toast) {
//   const id = genId();

//   const update = (props: ToasterToast) =>
//     dispatch({
//       type: "UPDATE_TOAST",
//       toast: { ...props, id },
//     });

//   const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

//   dispatch({
//     type: "ADD_TOAST",
//     toast: {
//       ...props,
//       id,
//       open: true,
//       onOpenChange: (open: any) => {
//         if (!open) dismiss();
//       },
//     },
//   });

//   return {
//     id: id,
//     dismiss,
//     update,
//   };
// }

// function useToast() {
//   const [state, setState] = useState<ToasterToast[]>(memoryState);

//   const handleListen = useCallback(() => {
//     listeners.push(setState);
//     return () => {
//       const index = listeners.indexOf(setState);
//       if (index > -1) {
//         listeners.splice(index, 1);
//       }
//     };
//   }, []);

//   if (typeof window !== "undefined") {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     handleListen();
//   }

//   return {
//     toast,
//     dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
//     toasts: state,
//   };
// }

// export { useToast, toast };

"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
}

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = Toast & {
  id: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

const listeners: Array<(state: ToasterToast[]) => void> = [];

let memoryState: ToasterToast[] = [];

function dispatch(action: any) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function reducer(state: ToasterToast[], action: any): ToasterToast[] {
  switch (action.type) {
    case "ADD_TOAST": {
      return [action.toast, ...state].slice(0, TOAST_LIMIT);
    }

    case "UPDATE_TOAST": {
      return state.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );
    }

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", toastId });
        }, TOAST_REMOVE_DELAY);
      } else {
        state.forEach((toast) => {
          setTimeout(() => {
            dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
          }, TOAST_REMOVE_DELAY);
        });
      }

      return state.map((t) =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t
      );
    }
    case "REMOVE_TOAST": {
      if (action.toastId === undefined) {
        return [];
      }
      return state.filter((t) => t.id !== action.toastId);
    }
    default:
      return state;
  }
}

function toast(props: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: any) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState<ToasterToast[]>(memoryState);

  const handleListen = useCallback(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    handleListen();
  }

  return {
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    toasts: state,
  };
}

export { useToast, toast };
