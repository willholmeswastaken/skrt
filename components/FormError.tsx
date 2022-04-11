import React from 'react'
import { ExclamationIcon } from '@heroicons/react/outline'

interface IFormErrorProps {
    error: string;
}

const FormError = ({ error }: IFormErrorProps) => {
  return (
      <>
      {
          error &&
          <div className='flex text-red-600 mt-2'>
              <ExclamationIcon height={25} className='pr-1' />
              {error}
          </div>
      }
      </>
  )
}

export default FormError