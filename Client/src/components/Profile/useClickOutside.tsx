import { useEffect } from "react";

export default function useClickOutside(ref: any, handler: any){
    useEffect(() => {
        const listener = (event:MouseEvent) => {
            const el = ref?.current;

            if (!el || el.contains(event.target)) {
                return
            }
            handler(event)
        }
        document.addEventListener("mousedown", listener)

        return() => {
            document.removeEventListener("mousedown", listener)
        }

    },[ref, handler])
}