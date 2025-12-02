/**
 * Button Component
 * 
 * Componente de botão reutilizável com variantes de estilo.
 * Utiliza as classes do Tailwind definidas no tema gamer.
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
    isLoading?: boolean;
}

/**
 * Button
 * 
 * @param variant - Estilo do botão (primary, secondary, danger)
 * @param fullWidth - Se true, ocupa 100% da largura
 * @param isLoading - Mostra loading spinner
 * @param children - Conteúdo do botão
 */
export const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseClasses = 'font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/50',
        secondary: 'bg-dark-600 hover:bg-dark-500 text-gray-100 shadow-lg',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/50',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando...
                </span>
            ) : children}
        </button>
    );
};
