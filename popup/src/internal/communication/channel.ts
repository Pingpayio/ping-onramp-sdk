import { createTypedChannel } from "typed-channel";
import { createPostMessageTransport } from "typed-channel";
import type { SdkToPopupMessages, PopupToSdkMessages } from "../../../../src/internal/communication/messages";
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { onrampStepAtom } from '../../state/atoms';

// Jotai atom to hold the channel instance
// Making it writable from this module
const popupChannelAtomInternal = atom<ReturnType<typeof createTypedChannel<SdkToPopupMessages, PopupToSdkMessages>> | null>(null);

// Export a read-only version for components, and a setter for this hook
export const popupChannelAtom = atom((get) => get(popupChannelAtomInternal));
const setPopupChannelAtom = atom(null, (_get, set, update: ReturnType<typeof createTypedChannel<SdkToPopupMessages, PopupToSdkMessages>> | null) => {
  set(popupChannelAtomInternal, update);
});


// Custom hook to get the channel instance and handle initial setup
export function usePopupChannel() {
    const channel = useAtomValue(popupChannelAtom);
    const [, setChannel] = useAtom(setPopupChannelAtom); // Use the setter
    const [currentStep, setCurrentStep] = useAtom(onrampStepAtom); // Make currentStep writable if needed for error handling

    useEffect(() => {
        // Initialize the channel when the component mounts
        if (!window.opener) {
            console.error("Popup was not opened by another window.");
            // Handle this error state in the UI, e.g., by setting an error step
            setCurrentStep("error"); 
            // Potentially set an error message in another atom if you have one
            return;
        }

        console.log("[Popup Channel] Attempting to create transport with window.opener:", window.opener);
        try {
            const transport = createPostMessageTransport<SdkToPopupMessages, SdkToPopupMessages>(window.opener);
            console.log("[Popup Channel] Transport created successfully:", transport);
            
            // Temporarily comment out the next lines to isolate the error source
            // const newChannel = createTypedChannel(transport);
            // console.log("[Popup Channel] Channel created successfully:", newChannel);
            // setChannel(newChannel); 

            // For now, to prevent further errors if transport is the issue, let's set a dummy channel or null
            setChannel(null); 

        } catch (e) {
            console.error("[Popup Channel] Error during transport or channel creation:", e);
            setCurrentStep("error");
        }

        // Clean up the channel when the component unmounts or popup closes
        // This cleanup might need adjustment based on whether newChannel was set
        return () => {
             setChannel(null); // Clear the atom
        };
    }, [setChannel, setCurrentStep]); // setChannel and setCurrentStep are stable


    // Listen for global popup close events and send message to SDK
     useEffect(() => {
         if (!channel) return;

         const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
             // Check if the process is still active (not complete or failed)
             if (currentStep !== 'complete' && currentStep !== 'error') {
                 try {
                    channel.emit("popup-closed-by-user", undefined);
                 } catch (e) {
                    console.warn("Failed to emit popup-closed-by-user, channel might be closed.", e);
                 }
             }
             // Note: You can't reliably prevent the window from closing here.
         };

         window.addEventListener('beforeunload', handleBeforeUnload);

         return () => {
             window.removeEventListener('beforeunload', handleBeforeUnload);
         };
     }, [channel, currentStep]); // Re-run if channel or step changes


    return { channel };
}
