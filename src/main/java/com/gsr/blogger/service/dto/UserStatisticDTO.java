package com.gsr.blogger.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.gsr.blogger.domain.UserStatistic} entity.
 */
public class UserStatisticDTO implements Serializable {

    private Long id;

    private Instant lastActive;

    private Integer numberOfPosts;

    private Integer numberOfComments;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getLastActive() {
        return lastActive;
    }

    public void setLastActive(Instant lastActive) {
        this.lastActive = lastActive;
    }

    public Integer getNumberOfPosts() {
        return numberOfPosts;
    }

    public void setNumberOfPosts(Integer numberOfPosts) {
        this.numberOfPosts = numberOfPosts;
    }

    public Integer getNumberOfComments() {
        return numberOfComments;
    }

    public void setNumberOfComments(Integer numberOfComments) {
        this.numberOfComments = numberOfComments;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserStatisticDTO)) {
            return false;
        }

        UserStatisticDTO userStatisticDTO = (UserStatisticDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userStatisticDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserStatisticDTO{" +
            "id=" + getId() +
            ", lastActive='" + getLastActive() + "'" +
            ", numberOfPosts=" + getNumberOfPosts() +
            ", numberOfComments=" + getNumberOfComments() +
            "}";
    }
}
