// src/components/Camera/CameraPermissions.tsx
import React from 'react';
import { Camera, AlertCircle, Settings, Loader2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

interface CameraPermissionsProps {
  onGranted: () => void;
  onDenied: (error: Error) => void;
}

const CameraPermissions: React.FC<CameraPermissionsProps> = ({ 
  onGranted, 
  onDenied 
}) => {
  const { 
    cameraPermission, 
    requestCameraPermission 
  } = usePermissions();

  React.useEffect(() => {
    if (cameraPermission.state === 'granted') {
      onGranted();
    } else if (cameraPermission.state === 'denied' && cameraPermission.error) {
      onDenied(new Error(cameraPermission.error));
    }
  }, [cameraPermission, onGranted, onDenied]);

  const handleRequestPermission = async () => {
    await requestCameraPermission();
  };

  if (cameraPermission.state === 'checking') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Checking Camera Access...
        </h2>
        <p className="text-gray-600">
          Please wait while we check your camera permissions.
        </p>
      </div>
    );
  }

  if (cameraPermission.state === 'requesting') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Camera className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Requesting Camera Access...
        </h2>
        <p className="text-gray-600">
          Please allow camera access when prompted by your browser.
        </p>
      </div>
    );
  }

  if (cameraPermission.state === 'denied') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Camera Access Required
        </h2>
        <p className="text-gray-600 mb-6">
          {cameraPermission.error || 'Camera access is required to use the photo booth.'}
        </p>
        <div className="space-y-4">
          <button
            onClick={handleRequestPermission}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Allow Camera Access
          </button>
          <div className="text-sm text-gray-500 space-y-2">
            <div className="flex items-center justify-center">
              <Settings className="w-4 h-4 mr-1" />
              <span>Enable camera in browser settings</span>
            </div>
            <div className="text-xs">
              Look for the camera icon in your browser's address bar
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CameraPermissions;
