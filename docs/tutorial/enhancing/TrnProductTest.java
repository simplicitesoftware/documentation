package com.simplicite.tests.Training;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.json.JSONObject;
import org.junit.Test;

import com.simplicite.bpm.*;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;

/**
 * Unit tests for the TrnProduct business object
 * Tests the product stock management functionality
 */
public class TrnProductTest {

    /**
     * Helper method to get system admin grant for testing
     * @return Grant with system admin privileges
     */
	public Grant getGrant() {
        // Using the system admin grant for testing
        return Grant.getSystemAdmin();
    }
    
    /**
     * Test the increaseStock action
     * Verifies that calling increaseStock increases the product stock by 10 units
     */
    @Test
    public void testIncreaseStock() {
        try {
            // Create a test product with initial stock of 5
            ObjectDB product = getGrant().getTmpObject("TrnProduct");
            // Set test product data using JSON
            product.setValuesFromJSONObject(new JSONObject()
                .put("trnPrdCode", "TEST001")
                .put("trnPrdName", "Test Product")
                .put("trnPrdStock", 5), true, false, false);
            // Save the test product to database
            product.save();
            
            // Get reference to stock field and store initial value
            ObjectField stockField = product.getField("trnPrdStock");
            int initialStock = stockField.getInt(0);
            
            // Execute the increaseStock action on the product
            product.invokeAction("IncreaseStock", null);
            
            // Assert that stock increased by exactly 10 units
            assertEquals("Stock should be increased by 10", initialStock + 10, stockField.getInt(0));
            
            // Cleanup by removing test product from database
            product.delete();
        }
        catch (Exception e) {
            // Fail test and show error if any exception occurs
            fail("Test failed: " + e.getMessage());
        }
    }
}