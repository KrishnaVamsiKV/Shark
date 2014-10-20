package com.nflabs.zeppelin.rest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.nflabs.zeppelin.server.JsonResponse;
import com.nflabs.zeppelin.server.ZQLJob;
import com.nflabs.zeppelin.server.ZQLJobManager;
import com.nflabs.zeppelin.zengine.ZException;
import com.nflabs.zeppelin.zengine.stmt.Z;
import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

@Path("/zql")
@Api( value = "/zql", description = "ZQL is very simple but powerful SQL like language based on HiveQL" )
public class ZQLRestApi {

    /**
     * This is required by Swagger
     */
  public ZQLRestApi() {
    super();
  }

    Logger logger = LoggerFactory.getLogger(ZQLRestApi.class);

	@SuppressWarnings("rawtypes")
    private static final Response STATUS_NOT_FOUND = new JsonResponse(Status.NOT_FOUND).build();
	ZQLJobManager jobManager;
	private Gson gson;

	public ZQLRestApi(ZQLJobManager jobManager){
		this.jobManager = jobManager;
		gson = new Gson();
	}

    @GET
    @Path("/new")
  @ApiOperation(httpMethod = "GET", value = "Create a new job session", response = Response.class)
  @ApiResponses(value = {@ApiResponse(code = 200, message = "New job created")})
    @Produces("application/json")
    public Response newJob() {
    	ZQLJob s = jobManager.create();
        return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

	static class SetZqlParam{
		String name;
		String zql;
		String cron;
		List<Map<String, Object>> params;
	}

  @POST
  @Path("/set/{sessionId}")
  @ApiOperation(httpMethod = "POST", value = "Update Zeppelin job", response = Response.class)
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Job Updated"),
      @ApiResponse(code = 404, message = "Job update failled due to a missing element")})
  @Produces("application/json")
  public Response set(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId, String json) {

    	SetZqlParam data = gson.fromJson(json, SetZqlParam.class);
    	ZQLJob s = jobManager.setZql(jobId, data.zql);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}

    	s = jobManager.setParams(jobId, data.params);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}

    	s = jobManager.setName(jobId, data.name);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}

    	s = jobManager.setCron(jobId, data.cron);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}
    	return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @POST
    @Path("/set/{sessionId}/zql")
    @ApiOperation(httpMethod = "POST", value = "Update zql of the Zeppelin job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Job Updated"), @ApiResponse(code = 404, message = "Job update failled due to a missing element")} )
    @Produces("application/json")
    public Response setZql(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId, String json) {

    	SetZqlParam data = gson.fromJson(json, SetZqlParam.class);
    	ZQLJob s = jobManager.setZql(jobId, data.zql);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}
    	return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @POST
    @Path("/set/{sessionId}/name")
    @ApiOperation(httpMethod = "POST", value = "Update the name of Zeppelin's job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Job Updated"), @ApiResponse(code = 404, message = "Job update failled due to a missing element")} )
    @Produces("application/json")
    public Response setName(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId, String json) {
    	SetZqlParam data = gson.fromJson(json, SetZqlParam.class);
    	ZQLJob s = jobManager.setName(jobId, data.name);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}
    	return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @POST
    @Path("/set/{sessionId}/params")
    @ApiOperation(httpMethod = "POST", value = "Update the parameters of Zeppelin's job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Job Updated"), @ApiResponse(code = 404, message = "Job update failled due to a missing element")} )
    @Produces("application/json")
    public Response setParams(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId, String json) {
    	SetZqlParam data = gson.fromJson(json, SetZqlParam.class);
    	ZQLJob s = jobManager.setParams(jobId, data.params);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}
    	return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @POST
    @Path("/set/{sessionId}/cron")
    @ApiOperation(httpMethod = "POST", value = "Update the crontab of Zeppelin's job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Job Updated"), @ApiResponse(code = 404, message = "Job update failled due to a missing element")} )
    @Produces("application/json")
    public Response setCron(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId, String json) {
    	SetZqlParam data = gson.fromJson(json, SetZqlParam.class);
    	ZQLJob s = jobManager.setCron(jobId, data.cron);
    	if(s==null){
    		return STATUS_NOT_FOUND;
    	}
    	return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @GET
    @Path("/run/{sessionId}")
    @ApiOperation(httpMethod = "GET", value = "Run a Zeppelin job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Run successfully"), @ApiResponse(code = 404, message = "Run failled")} )
    @Produces("application/json")
    public Response run(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId) {
    	 ZQLJob s = jobManager.run(jobId);
    	 if(s==null){
    		 return STATUS_NOT_FOUND;
    	 }
    	 return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @GET
    @Path("/run/{sessionId}/dry")
    @ApiOperation(httpMethod = "GET", value = "Run a Zeppelin job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Run successfully"), @ApiResponse(code = 404, message = "Run failled")} )
    @Produces("application/json")
    public Response dryRun(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId) {
    	 ZQLJob s = jobManager.dryRun(jobId);
    	 if(s==null){
    		 return STATUS_NOT_FOUND;
    	 }
    	 return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @GET
    @Path("/abort/{sessionId}")
    @ApiOperation(httpMethod = "GET", value = "Abort a Zeppelin job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Run successfully"), @ApiResponse(code = 404, message = "Run failled")} )
    @Produces("application/json")
    public Response abort(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId) {
    	 ZQLJob s = jobManager.abort(jobId);
    	 if(s==null){
    		 return STATUS_NOT_FOUND;
    	 }
    	 return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    @GET
    @Path("/get/{sessionId}")
    @ApiOperation(httpMethod = "GET", value = "Get Zeppelin job id", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Run successfully"), @ApiResponse(code = 404, message = "Run failled")} )
    @Produces("application/json")
    public Response get(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId) {
    	 ZQLJob s = jobManager.get(jobId);
    	 if(s==null) {
    		 return STATUS_NOT_FOUND;
    	 }
         return new JsonResponse<ZQLJob>(Status.OK, "", s).build();
    }

    /**
     * list jobs
     * @return
     */
    @GET
    @Path("/list")
    @ApiOperation(httpMethod = "GET", value = "List all the Zeppelin job", response = Response.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Run successfully"), @ApiResponse(code = 404, message = "Run failled")} )
    @Produces("application/json")
    public Response find() {
    	TreeMap<String, ZQLJob> sessions = jobManager.list();
        return new JsonResponse<LinkedList<ZQLJob>>(Status.OK, "",
                new LinkedList<ZQLJob>(sessions.descendingMap().values()))
                .build();
    }

    @GET
    @Path("/del/{sessionId}")
    @ApiOperation(httpMethod = "GET", value = "Remove a Zeppelin job", response = Response.class)
    @Produces("application/json")
    public Response del(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId) {
    	 boolean s = jobManager.delete(jobId);
    	 if(s==false){
    		 return STATUS_NOT_FOUND;
    	 }
    	 return new JsonResponse<ZQLJob>(Status.OK).build();
    }

    /**
     * Get session history list
     * @return
     */
    @GET
    @Path("/history/list/{sessionId}")
    @ApiOperation(httpMethod = "GET", value = "List of the history from a Zeppelin job", response = Response.class)
    @Produces("application/json")
    public Response listHistory(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId) {
    	TreeMap<String, ZQLJob> sessions = jobManager.listHistory(jobId);
        return new JsonResponse<NavigableMap<String, ZQLJob>>(Status.OK, "", sessions.descendingMap()).build();
    }

    /**
     * Get a session history
     * @return
     */
    @GET
    @Path("/history/get/{sessionId}/{name}")
    @ApiOperation(httpMethod = "GET", value = "Detail of the history from a Zeppelin job", response = Response.class)
    @Produces("application/json")
    public Response getHistory(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId, @ApiParam(value = "Name of the history", required = true) @PathParam("name") String name) {
    	ZQLJob session = jobManager.getHistory(jobId, name);
        return new JsonResponse<ZQLJob>(Status.OK, "", session).build();
    }

    /**
     * Delete a session history
     * @return
     */
    @GET
    @Path("/history/del/{sessionId}/{name}")
    @ApiOperation(httpMethod = "GET", value = "Remove history Zeppelin job", response = Response.class)
    @Produces("application/json")
    public Response deleteHistory(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId, @ApiParam(value = "Name of the history", required = true) @PathParam("name") String name) {
    	jobManager.deleteHistory(jobId, name);
        return new JsonResponse<ZQLJob>(Status.OK).build();
    }

    /**
     * Delete all session history
     * @return
     */
    @GET
    @Path("/history/del/{sessionId}")
    @ApiOperation(httpMethod = "GET", value = "Remove history Zeppelin job", response = Response.class)
    @Produces("application/json")
    public Response deleteHistory(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId) {
    	jobManager.deleteHistory(jobId);
        return new JsonResponse<ZQLJob>(Status.OK).build();
    }



    @GET
    @Path("/web/{sessionId}/{zId}/{path:.*}")
    @ApiOperation(httpMethod = "GET", value = "Getinformation about job", response = Response.class)
    public Response web(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId,
        @ApiParam(value = "zId", required = true) @PathParam("zId") String zId,
        @ApiParam(value = "Path", required = true) @PathParam("path") String path){
    	ZQLJob session = jobManager.get(jobId);
    	if(session==null){
    		return STATUS_NOT_FOUND;
    	}
    	if(path==null || path.equals("/") || path.length()==0){
    		path = "/index.erb";
    	}

    	List<Z> plans = session.getPlan();
    	for(Z plan : plans){
    		for(Z z = plan; z!=null; z=z.prev()){
	    		if(z.getId().equals(zId)){
	    			try {
						InputStream ins = z.readWebResource(path);
                        return ins != null ? Response.ok(IOUtils.toByteArray(ins), typeByExtention(path)).build() : null;
					} catch (ZException e) {
						logger.error("Can't read web resource", e);
						return new JsonResponse<ZQLJob>(Status.INTERNAL_SERVER_ERROR, e.getMessage()).build();
					} catch (IOException e) {
						logger.error("IOexception", e);
						return new JsonResponse<ZQLJob>(Status.INTERNAL_SERVER_ERROR, e.getMessage()).build();
					}
	    		}
    		}
    	}
		return javax.ws.rs.core.Response.status(Status.NOT_FOUND).entity("").build();
    }

    @GET
    @Path("/history/web/{sessionId}/{historyId}/{zId}/{path:.*}")
    @ApiOperation(httpMethod = "GET", value = "Getinformation about job", response = Response.class)
    public Response historyWeb(@ApiParam(value = "ID of the zeppelin job", required = true) @PathParam("sessionId") String jobId,
        @ApiParam(value = "history id", required = true) @PathParam("historyId") String historyId,
        @ApiParam(value = "ZID", required = true) @PathParam("zId") String zId,
        @ApiParam(value = "path", required = true) @PathParam("path") String path){
    	ZQLJob job = jobManager.getHistory(jobId, historyId);
    	if(job==null){
    		logger.warn("Session "+jobId+", history "+historyId+" not found");
    		return STATUS_NOT_FOUND;
    	}
    	if(path==null || path.equals("/") || path.length()==0){
    		path = "/index.erb";
    	}

    	List<Z> plans = job.getPlan();
    	for(Z plan : plans){
    		for(Z z = plan; z!=null; z=z.prev()){
	    		if(z.getId().equals(zId)){
	    			try {
						InputStream ins = z.readWebResource(path);
						return ins != null ? Response.ok(IOUtils.toByteArray(ins), typeByExtention(path)).build() : null;
					} catch (ZException e) {
						logger.error("Can't read web resource", e);
						return new JsonResponse<ZQLJob>(Status.INTERNAL_SERVER_ERROR, e.getMessage()).build();
					} catch (IOException e) {
						logger.error("IOexception", e);
						return new JsonResponse<ZQLJob>(Status.INTERNAL_SERVER_ERROR, e.getMessage()).build();
					}
	    		}
    		}
    	}
		return javax.ws.rs.core.Response.status(Status.NOT_FOUND).entity("").build();
    }

    private String typeByExtention(String path){
    	String filename;
		try {
			filename = new URI(path).getPath();
		} catch (URISyntaxException e) {
			logger.error("Invalid path "+path, e);
			return MediaType.APPLICATION_OCTET_STREAM_TYPE.toString();
		}

    	if(filename.endsWith(".erb")) {
    		return MediaType.TEXT_HTML_TYPE.toString();
    	} else if(filename.endsWith(".html") || filename.endsWith(".htm")){
    		return MediaType.TEXT_HTML_TYPE.toString();
    	} else if(filename.endsWith(".css")){
    		return "text/css";
    	} else if(filename.endsWith(".js")){
    		return "text/javascript";
    	} else if(filename.endsWith(".json")){
    		return MediaType.APPLICATION_JSON_TYPE.toString();
    	} else if(filename.endsWith(".xml")){
    		return MediaType.APPLICATION_XML_TYPE.toString();
    	} else if(filename.endsWith(".text") || filename.endsWith(".txt")){
    		return MediaType.TEXT_PLAIN_TYPE.toString();
    	} else {
    		return MediaType.APPLICATION_OCTET_STREAM_TYPE.toString();
    	}
    }

}
