/**
 * Card Component
 * 
 * Componente de card com efeito glassmorphism.
 * Utilizado para containers de conteúdo com estética gamer.
 */

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

/**
 * Card
 * 
 * @param children - Conteúdo do card
 * @param className - Classes adicionais
 * @param noPadding - Remove padding padrão
 */
export const Card = ({ children, className = '', noPadding = false }: CardProps) => {
    const paddingClass = noPadding ? '' : 'p-6';

    return (
        <div className={`card-glass ${paddingClass} ${className}`}>
            {children}
        </div>
    );
};
