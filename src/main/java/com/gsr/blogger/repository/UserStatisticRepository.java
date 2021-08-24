package com.gsr.blogger.repository;

import com.gsr.blogger.domain.UserStatistic;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserStatistic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserStatisticRepository extends JpaRepository<UserStatistic, Long> {}
