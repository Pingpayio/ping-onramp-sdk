// popup/src/internal/communication/channel.ts

import { createTypedChannel } from "typed-channel";
import { createPostMessageTransport } from "typed-channel"; // User updated this path
import type { SdkToPopupMessages, PopupToSdkMessages, OnrampFlowStep } from "../../../src/internal/communication/messages"; // Import from shared messages
import { atom, useAtom, useAtomValue } from 'jotai'; // useAtom is needed to set the atom
import { useEffect } from 'react';
import { onrampStepAtom } from '../../state/atoms'; // Adjusted path

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

        const newChannel = createTypedChannel(createPostMessageTransport<SdkToPopupMessages, SdkToPopupMessages>(window.opener, {
             // Optional: Add origin validation for security
             targetOrigin: '*', // IMPORTANT: Replace '*' with the actual origin of the parent window
             // validateMessage: (event) => { /* Add your validation logic here */ return true; }
        }));

        setChannel(newChannel); // Store the channel in Jotai using the setter

        // Example: Listen for "initiate-onramp-flow" in App.tsx or a dedicated effect here
        // newChannel.on('initiate-onramp-flow', (payload) => {
        //   console.log('Received initiate-onramp-flow:', payload);
        //   // Update Jotai atoms based on payload (target, initialData)
        //   // setOnrampTargetAtom(payload.target);
        //   // setInitialDataAtom(payload.initialData);
        //   // setCurrentStep('form-entry'); // Or based on initialData
        // });


        // Clean up the channel when the component unmounts or popup closes
        return () => {
            if (newChannel) {
                // newChannel.close(); // If typed-channel provides a close method
            }
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
