import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';
import type { 
    AppError,
    ErrorBoundaryState, 
    ErrorCode
} from '../../types/error';
import {  
  isRecoverableError,
  getErrorSeverity
} from '../../types/error';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableReporting?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Photo Booth Error Boundary:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // Log to error reporting service in production
    if (this.props.enableReporting && process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    const errorData: AppError = {
      code: this.getErrorCode(error),
      message: error.message,
      details: errorInfo.componentStack,
      timestamp: Date.now(),
      recoverable: this.isRecoverableError(error)
    };

    // In a real app, send to error reporting service
    console.log('Logging error to service:', errorData);
    
    // Example: Send to analytics or error tracking service
    // analytics.track('error_boundary_triggered', errorData);
  };

  private getErrorCode = (error: Error): ErrorCode => {
    if (error.message.includes('camera')) {
      if (error.message.includes('not supported')) return 'CAMERA_NOT_SUPPORTED';
      if (error.message.includes('permission')) return 'CAMERA_PERMISSION_DENIED';
      if (error.message.includes('not found')) return 'CAMERA_NOT_FOUND';
      return 'CAMERA_INITIALIZATION_FAILED';
    }
    if (error.message.includes('canvas')) {
      if (error.message.includes('context')) return 'CANVAS_CONTEXT_ERROR';
      return 'CANVAS_ERROR';
    }
    if (error.message.includes('permission')) return 'PERMISSION_ERROR';
    if (error.message.includes('download')) return 'DOWNLOAD_FAILED';
    if (error.message.includes('storage')) return 'STORAGE_ERROR';
    if (error.message.includes('filter')) return 'FILTER_APPLICATION_ERROR';
    if (error.message.includes('layout')) return 'LAYOUT_COMPOSITION_ERROR';
    if (error.message.includes('processing')) return 'IMAGE_PROCESSING_ERROR';
    if (error.message.includes('network')) return 'NETWORK_ERROR';
    return 'UNKNOWN_ERROR';
  };

  private isRecoverableError = (error: Error): boolean => {
    const recoverableErrors = ['canvas', 'download', 'filter'];
    return recoverableErrors.some(keyword => 
      error.message.toLowerCase().includes(keyword)
    );
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    } else {
      window.location.reload();
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private getErrorTitle = (): string => {
    if (!this.state.error) return 'Something went wrong';
    
    const error = this.state.error;
    if (error.message.includes('camera')) return 'Camera Error';
    if (error.message.includes('permission')) return 'Permission Error';
    if (error.message.includes('canvas')) return 'Photo Processing Error';
    return 'Application Error';
  };

  private getErrorMessage = (): string => {
    if (!this.state.error) return 'The photo booth encountered an unexpected error.';
    
    const error = this.state.error;
    if (error.message.includes('camera')) {
      return 'There was a problem accessing your camera. Please check permissions and try again.';
    }
    if (error.message.includes('permission')) {
      return 'Camera permissions are required. Please allow access and refresh the page.';
    }
    if (error.message.includes('canvas')) {
      return 'There was an issue processing your photo. This might be a temporary problem.';
    }
    return 'An unexpected error occurred. Please try refreshing the page.';
  };

  private getRetryButtonText = (): string => {
    if (this.retryCount >= this.maxRetries) return 'Refresh Page';
    return `Try Again (${this.maxRetries - this.retryCount} attempts left)`;
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            resetError={this.handleRetry}
          />
        );
      }

      const isRecoverable = this.state.error ? isRecoverableError(this.state.error) : false;
      const recoveryStrategies = this.getRecoveryStrategies();
      const errorSeverity = this.state.error ? getErrorSeverity(this.getErrorCode(this.state.error)) : 'medium';
      const isDevelopment = import.meta.env.MODE === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {this.getErrorTitle()}
              </h1>
              <p className="text-gray-600 text-lg">
                {this.getErrorMessage()}
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {isDevelopment && this.state.error && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <details className="text-sm">
                  <summary className="font-medium text-gray-700 cursor-pointer flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Details (Development Mode)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <strong className="text-gray-700">Error:</strong>
                      <pre className="mt-1 p-2 bg-red-50 rounded text-red-700 text-xs overflow-x-auto">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong className="text-gray-700">Component Stack:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-600 text-xs overflow-x-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{this.getRetryButtonText()}</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Recovery Strategies */}
            {isRecoverable && recoveryStrategies.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Try these solutions:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  {recoveryStrategies.map((strategy, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error Severity Indicator */}
            {errorSeverity === 'high' || errorSeverity === 'critical' ? (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 text-center">
                  ⚠️ This is a {errorSeverity} error that may require immediate attention.
                </p>
              </div>
            ) : null}

            {/* Support Information */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                If this problem persists, please try using a different browser or check that your camera is working properly.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
