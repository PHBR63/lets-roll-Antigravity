/**
 * Input Component
 * 
 * Componente de input reutilizável com label e mensagem de erro.
 * Segue o design system com tema escuro gamer.
 */

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

/**
 * Input
 * 
 * @param label - Label do input
 * @param error - Mensagem de erro (aparece abaixo do input)
 * @param className - Classes adicionais
 */
export const Input = ({ label, error, className = '', ...props }: InputProps) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`input-field w-full ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};
