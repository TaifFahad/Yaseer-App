package com.seniorproject.facerecognitionpart;

import static android.content.ContentValues.TAG;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.media.ThumbnailUtils;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;
import com.seniorproject.facerecognitionpart.ml.ModelNum2;
import com.google.firebase.FirebaseApp;
import org.tensorflow.lite.DataType;
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    Button camera;
    ImageView imageView;
    TextView result;
    int imageSize = 150;
    ModelNum2 model;
    private FirebaseFirestore db;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db = FirebaseFirestore.getInstance();
        FirebaseApp.initializeApp(this);

        camera = findViewById(R.id.button);
        result = findViewById(R.id.result);
        imageView = findViewById(R.id.imageView);

        try {
            model = ModelNum2.newInstance(getApplicationContext());
        } catch (IOException e) {
            Log.e("MainActivity", "Failed to load model.", e);
        }

        camera.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        startActivityForResult(cameraIntent, 3);
                    } else {
                        requestPermissions(new String[]{Manifest.permission.CAMERA}, 100);
                    }
                }
            }
        });
    }

    private void saveAttendance(String studentName, String documentId) {
        Map<String, Object> attendanceData = new HashMap<>();
        attendanceData.put("studentName", studentName);
        attendanceData.put("timestamp", System.currentTimeMillis());

        db.collection("1").document(documentId).collection("attendanceAI")
                .add(attendanceData)
                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                    @Override
                    public void onSuccess(DocumentReference documentReference) {
                        Log.d(TAG, "DocumentSnapshot added with ID: " + documentReference.getId());
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "Error adding document", e);
                    }
                });
    }

    public void classifyImage(Bitmap image) {
        if (model == null) {
            Log.e("MainActivity", "Model is not loaded.");
            return;
        }

        try {
            int bufferSize = 4 * imageSize * imageSize * 3;
            TensorBuffer inputFeature0 = TensorBuffer.createFixedSize(new int[]{1, imageSize, imageSize, 3}, DataType.FLOAT32);
            ByteBuffer byteBuffer = ByteBuffer.allocateDirect(bufferSize);
            byteBuffer.order(ByteOrder.nativeOrder());

            int[] intValues = new int[imageSize * imageSize];
            image.getPixels(intValues, 0, image.getWidth(), 0, 0, image.getWidth(), image.getHeight());
            int pixel = 0;

            for (int i = 0; i < imageSize; i++) {
                for (int j = 0; j < imageSize; j++) {
                    int val = intValues[pixel++];
                    byteBuffer.putFloat(((val >> 16) & 0xFF) * (1.f / 255));
                    byteBuffer.putFloat(((val >> 8) & 0xFF) * (1.f / 255));
                    byteBuffer.putFloat((val & 0xFF) * (1.f / 255));
                }
            }

            inputFeature0.loadBuffer(byteBuffer);
            ModelNum2.Outputs outputs = model.process(inputFeature0);
            TensorBuffer outputFeature0 = outputs.getOutputFeature0AsTensorBuffer();

            float[] confidences = outputFeature0.getFloatArray();

            String[] classes = {"Lina", "Malak", "Raed", "Sondos"};
            int maxPos = 0;
            float maxConfidence = 0;

            for (int i = 0; i < confidences.length; i++) {
                if (confidences[i] > maxConfidence) {
                    maxConfidence = confidences[i];
                    maxPos = i;
                }
            }

            String resultText = "Unknown";
            if (maxPos >= 0 && maxPos < classes.length) {
                resultText = classes[maxPos];
                handleAttendance(resultText);
            }
            result.setText(resultText);

        } catch (Exception e) {
            Log.e("MainActivity", "Failed to classify image.", e);
        }
    }

    private void handleAttendance(String studentName) {
        // Paths specific to each student
        Map<String, String[]> specificPaths = new HashMap<>();
        specificPaths.put("Raed", new String[]{
                "5vPMCZacxdQmmK8b6o7I7m3Nm0F2",
                "pd204ZRZVTebshBhsjJBijD49lg2"});
        specificPaths.put("Lina", new String[]{
                "ZfCW2aBFSUc9R7WlLpIixeexokC3",
                "2nn8W2twl1OCMtcdNuvKecMXAIo2"});
        specificPaths.put("Malak", new String[]{
                "HO53IHzhLSVPABL3kJoTGfrP4Wm2",
                "SeeMUGQam5OMWuR6moOMEra7XhA3"});
        specificPaths.put("Sondos", new String[]{
                "Pp4aG6L5pJW8ZIIpTWnSK3vgKh52",
                "Z0ixB885c7UO0vv5s3VBMfkmJPi1"});

        // Check if student has specific paths defined
        if (!specificPaths.containsKey(studentName)) {
            Log.w(TAG, "No specific paths defined for: " + studentName);
            return;
        }

        // Add attendance only in the specific paths
        for (String relativePath : specificPaths.get(studentName)) {
            checkAndSaveAttendanceAtSpecificPath(studentName, relativePath);
        }
    }


    private void checkAndSaveAttendanceAtSpecificPath(String studentName, String documentId) {
        db.collection("1").document(documentId).collection("attendanceAI")
                .whereEqualTo("studentName", studentName)
                .get()
                .addOnSuccessListener(querySnapshot -> {
                    if (querySnapshot.size() < 2) { // Allow up to two records for the student
                        saveAttendanceAtSpecificPath(studentName, documentId);
                    } else {
                        Log.d(TAG, "Attendance for " + studentName + " has already been recorded twice in path: 1/" + documentId + "/attendanceAI");
                    }
                })
                .addOnFailureListener(e -> Log.w(TAG, "Error checking attendance for path: 1/" + documentId + "/attendanceAI", e));
    }


    private void saveAttendanceAtSpecificPath(String studentName, String documentId) {
        Map<String, Object> attendanceData = new HashMap<>();
        attendanceData.put("studentName", studentName);
        attendanceData.put("timestamp", System.currentTimeMillis());

        db.collection("1").document(documentId).collection("attendanceAI")
                .add(attendanceData)
                .addOnSuccessListener(documentReference -> {
                    Log.d(TAG, "Attendance added for " + studentName + " in path: 1/" + documentId + "/attendanceAI");
                })
                .addOnFailureListener(e -> Log.w(TAG, "Error adding attendance to path: 1/" + documentId + "/attendanceAI", e));
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK) {
            if (requestCode == 3 && data != null) {
                Bitmap image = (Bitmap) data.getExtras().get("data");
                int dimension = Math.min(image.getWidth(), image.getHeight());
                image = ThumbnailUtils.extractThumbnail(image, dimension, dimension);
                imageView.setImageBitmap(image);

                image = Bitmap.createScaledBitmap(image, imageSize, imageSize, false);
                classifyImage(image);
            }
        }
    }
}
