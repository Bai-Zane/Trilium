import { describe, it, expect } from 'vitest';
import { hasDelimiters, delimitersCounts, extractDelimiters } from '../src/utils.js';

describe('Math Utils - Dollar Delimiter Support', () => {
	describe('hasDelimiters', () => {
		it('should detect LaTeX inline delimiters', () => {
			expect(hasDelimiters('\\(x^2\\)')).toBeTruthy();
		});

		it('should detect LaTeX display delimiters', () => {
			expect(hasDelimiters('\\[x^2\\]')).toBeTruthy();
		});

		it('should detect single dollar delimiters', () => {
			expect(hasDelimiters('$x^2$')).toBeTruthy();
		});

		it('should detect double dollar delimiters', () => {
			expect(hasDelimiters('$$x^2$$')).toBeTruthy();
		});

		it('should not detect text without delimiters', () => {
			expect(hasDelimiters('x^2')).toBeFalsy();
		});

		it('should not detect incomplete delimiters', () => {
			expect(hasDelimiters('$x^2')).toBeFalsy();
			expect(hasDelimiters('x^2$')).toBeFalsy();
		});
	});

	describe('delimitersCounts', () => {
		it('should count LaTeX delimiters correctly', () => {
			expect(delimitersCounts('\\(x^2\\)')).toBe(2);
			expect(delimitersCounts('\\[x^2\\]')).toBe(2);
		});

		it('should count dollar delimiters correctly', () => {
			expect(delimitersCounts('$x^2$')).toBe(2);
			expect(delimitersCounts('$$x^2$$')).toBe(2);
		});

		it('should return undefined for mixed delimiters', () => {
			expect(delimitersCounts('\\($x^2$\\)')).toBeUndefined();
			expect(delimitersCounts('$\\[x^2\\]$')).toBeUndefined();
		});

		it('should handle incomplete delimiters', () => {
			expect(delimitersCounts('$x^2')).toBe(1);
			expect(delimitersCounts('x^2$$')).toBe(1);
		});
	});

	describe('extractDelimiters', () => {
		it('should extract LaTeX inline equation', () => {
			const result = extractDelimiters('\\(x^2\\)');
			expect(result.equation).toBe('x^2');
			expect(result.display).toBe(false);
		});

		it('should extract LaTeX display equation', () => {
			const result = extractDelimiters('\\[x^2\\]');
			expect(result.equation).toBe('x^2');
			expect(result.display).toBe(true);
		});

		it('should extract single dollar inline equation', () => {
			const result = extractDelimiters('$x^2$');
			expect(result.equation).toBe('x^2');
			expect(result.display).toBe(false);
		});

		it('should extract double dollar display equation', () => {
			const result = extractDelimiters('$$x^2$$');
			expect(result.equation).toBe('x^2');
			expect(result.display).toBe(true);
		});

		it('should handle complex equations with single dollars', () => {
			const result = extractDelimiters('$\\frac{a}{b}$');
			expect(result.equation).toBe('\\frac{a}{b}');
			expect(result.display).toBe(false);
		});

		it('should handle complex equations with double dollars', () => {
			const result = extractDelimiters('$$\\sum_{i=1}^{n} i^2$$');
			expect(result.equation).toBe('\\sum_{i=1}^{n} i^2');
			expect(result.display).toBe(true);
		});

		it('should trim whitespace', () => {
			const result = extractDelimiters('$  x^2  $');
			expect(result.equation).toBe('x^2');
		});

		it('should handle equations without delimiters', () => {
			const result = extractDelimiters('x^2');
			expect(result.equation).toBe('x^2');
			expect(result.display).toBe(false);
		});
	});
});
