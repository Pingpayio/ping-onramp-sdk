import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

// Define form values type - should match the one in App.tsx or be imported
export type FormValues = {
  amount: string;
  selectedAsset: string; 
  selectedCurrency: string; 
  paymentMethod: string; 
};

interface FormEntryViewProps {
  onSubmit: (data: FormValues) => void;
}

const FormEntryView: React.FC<FormEntryViewProps> = ({ onSubmit }) => {
  const methods = useForm<FormValues>();
  const { handleSubmit, register } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">Onramp Details</h2>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
          <input 
            type="number" 
            id="amount" 
            {...register('amount', { required: "Amount is required", min: { value: 0.01, message: "Amount must be positive" } })} 
            className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="e.g., 100"
          />
          {methods.formState.errors.amount && <p className="text-red-400 text-xs mt-1">{methods.formState.errors.amount.message}</p>}
        </div>
        <div>
          <label htmlFor="selectedAsset" className="block text-sm font-medium text-gray-300">Asset</label>
          <input 
            type="text" 
            id="selectedAsset" 
            {...register('selectedAsset', { required: "Asset is required" })} 
            defaultValue="USDC" 
            className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., USDC"
          />
          {methods.formState.errors.selectedAsset && <p className="text-red-400 text-xs mt-1">{methods.formState.errors.selectedAsset.message}</p>}
        </div>
        <div>
          <label htmlFor="selectedCurrency" className="block text-sm font-medium text-gray-300">Currency</label>
          <input 
            type="text" 
            id="selectedCurrency" 
            {...register('selectedCurrency', { required: "Currency is required" })} 
            defaultValue="USD" 
            className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., USD"
          />
          {methods.formState.errors.selectedCurrency && <p className="text-red-400 text-xs mt-1">{methods.formState.errors.selectedCurrency.message}</p>}
        </div>
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">Payment Method</label>
          <input 
            type="text" 
            id="paymentMethod" 
            {...register('paymentMethod', { required: "Payment method is required" })} 
            defaultValue="CARD" 
            className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., CARD"
          />
          {methods.formState.errors.paymentMethod && <p className="text-red-400 text-xs mt-1">{methods.formState.errors.paymentMethod.message}</p>}
        </div>
        <button 
          type="submit" 
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Continue
        </button>
      </form>
    </FormProvider>
  );
};

export default FormEntryView;
