package com.gsr.blogger.repository;

import com.gsr.blogger.domain.MUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MUserRepository extends JpaRepository<MUser, Long> {}
