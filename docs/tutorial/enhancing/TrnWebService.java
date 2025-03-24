package com.simplicite.extobjects.Training;

import java.util.*;
import org.json.*;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;

/**
 * REST service external object TrnWebService
 * This class implements a custom REST endpoint to retrieve supplier information including product counts
 */
public class TrnWebService extends com.simplicite.webapp.services.RESTServiceExternalObject {
	private static final long serialVersionUID = 1L;

	/**
	 * GET method handler that returns a list of suppliers with their product counts
	 * The response format is:
	 * {
	 *   "found": boolean,      // true if suppliers found, false otherwise
	 *   "suppliers": [         // array of supplier objects
	 *     {
	 *       "code": string,    // supplier code
	 *       "name": string,    // supplier name
	 *       "nbPrdInStock": number  // count of products in stock for this supplier
	 *     }
	 *   ]
	 * }
	 * @param params Request parameters (not used in this implementation)
	 * @return JSONObject containing supplier data
	 * @throws HTTPException if there is an error processing the request
	 */
	@Override
	public Object get(Parameters params) throws HTTPException {
		// Get grant and supplier object
		Grant g = getGrant();
		ObjectDB supplier = g.getIsolatedObject("TrnSupplier");
		
		// Initialize response object with empty results
		JSONObject results = new JSONObject()
			.put("found", false)
			.put("suppliers", new JSONArray());
		
		// Search for all suppliers
		List<String[]> rslts = supplier.search(false);
		if (rslts.isEmpty()) {
			return results; // Return early if no suppliers found
		}
		
		// Update found flag and get suppliers array
		results.put("found", true);
		JSONArray suppliers = results.getJSONArray("suppliers");
		
		// Process each supplier
		for (String[] row : rslts) {
			supplier.setValues(row);
			try {
				// Create supplier object with code, name and product count
				suppliers.put(new JSONObject()
					.put("code", supplier.getFieldValue("trnSupCode"))
					.put("name", supplier.getFieldValue("trnSupName"))
					.put("nbPrdInStock", countPrdInstock(supplier.getRowId())));
			} catch (SearchException e) {
				// Log error if product count fails for a supplier
				AppLog.error("Error counting products in stock for supplier " + supplier.getFieldValue("trnSupCode"), e);
			}
		}
		
		return results;
	}

	/**
	 * Helper method to count products in stock for a supplier
	 * Counts only products with stock > 0
	 * @param supRowId Supplier row ID to count products for
	 * @return Number of products in stock for the supplier
	 * @throws SearchException If the product search fails
	 */
	private long countPrdInstock(String supRowId) throws SearchException {
		// Create filter for products with stock > 0 belonging to supplier
		JSONObject filters = new JSONObject().put("demoPrdSupId", supRowId).put("demoPrdStock", "> 0");
		return getGrant().getIsolatedObject("TrnProduct").getTool().count(filters);
	}

}
