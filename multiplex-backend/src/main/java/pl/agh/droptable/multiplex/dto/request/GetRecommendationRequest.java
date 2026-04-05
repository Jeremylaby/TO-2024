package pl.agh.droptable.multiplex.dto.request;

import java.sql.Timestamp;

public class GetRecommendationRequest {
    private Timestamp startTimestamp;
    private Timestamp endTimestamp;

    public Timestamp getStartTimestamp() {
        return startTimestamp;
    }

    public void setStartTimestamp(Timestamp startTimestamp) {
        this.startTimestamp = startTimestamp;
    }

    public Timestamp getEndTimestamp() {
        return endTimestamp;
    }

    public void setEndTimestamp(Timestamp endTimestamp) {
        this.endTimestamp = endTimestamp;
    }
}
