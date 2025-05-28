// popup/src/components/form-step.tsx

import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useAtom } from 'jotai';
// import { formDataAtom, onrampStepAtom } from '../state/atoms';
// import { usePopupChannel } from '../internal/communication/channel';

// Define your form schema with Zod if using react-hook-form
// const formSchema = z.object({
//   // Define your form fields here
//   exampleField: z.string().min(1, "Example field is required"),
// });

// type FormData = z.infer<typeof formSchema>;

const FormStep: React.FC = () => {
  // const { channel } = usePopupChannel();
  // const [, setFormData] = useAtom(formDataAtom);
  // const [, setStep] = useAtom(onrampStepAtom);

  // const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  //   resolver: zodResolver(formSchema),
  // });

  // const onSubmit = (data: FormData) => {
  //   setFormData(data);
  //   channel?.emit('form-data-submitted', { formData: data });
  //   setStep('connecting-wallet'); // Or whatever the next step is
  // };

  return (
    <div>
      <h2>Form Step</h2>
      <p>Please fill out the necessary information.</p>
      {/*
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="exampleField">Example Field:</label>
          <input id="exampleField" {...register('exampleField')} />
          {errors.exampleField && <p>{errors.exampleField.message}</p>}
        </div>
        <button type="submit">Submit Form</button>
      </form>
      */}
      <p>Form UI will go here.</p>
    </div>
  );
};

export default FormStep;
